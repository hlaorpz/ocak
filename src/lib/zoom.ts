/**
 * zoom.ts — Zoom Server-to-Server OAuth helper.
 * Brief: brief-zoom-otomasyon-v3.md (KARAR 97 secret server-side, KARAR 104 basit).
 *
 * Public:
 *   zoomAccessToken(): account_credentials grant ile ~1 saatlik bearer token.
 *   zoomMeetingOlustur({ topic, startTime }): scheduled meeting yaratır → { join_url, meeting_id }.
 *
 * Token cache YOK — her çağrıda taze. Lansman hacmi düşük (etkinlik başına 1 çağrı).
 * ZoomError.kind: 'credential' (401/env eksik) vs 'scope' (403, meeting:write eksik) vs 'other'.
 */

const ACCOUNT_ID = import.meta.env.ZOOM_ACCOUNT_ID;
const CLIENT_ID = import.meta.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.ZOOM_CLIENT_SECRET;

export type ZoomMeetingArgs = {
  /** Notion "Başlık" — meeting topic. */
  topic: string;
  /** ISO datetime "YYYY-MM-DDTHH:MM:SS" (Europe/Istanbul yerel). Timezone ayrı gönderilir. */
  startTime: string;
};

export type ZoomMeetingResult = {
  join_url: string;
  meeting_id: number;
};

export class ZoomError extends Error {
  constructor(
    public status: number,
    public body: string,
    public kind: 'credential' | 'scope' | 'other',
  ) {
    super(`Zoom ${status} (${kind}): ${body.slice(0, 200)}`);
  }
}

export async function zoomAccessToken(): Promise<string> {
  if (!ACCOUNT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    throw new ZoomError(0, 'ZOOM_ACCOUNT_ID/CLIENT_ID/CLIENT_SECRET env eksik', 'credential');
  }
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ACCOUNT_ID}`,
    { method: 'POST', headers: { Authorization: `Basic ${basic}` } },
  );
  const body = await res.text();
  if (!res.ok) {
    throw new ZoomError(res.status, body, 'credential');
  }
  const json = JSON.parse(body) as { access_token: string };
  return json.access_token;
}

export async function zoomMeetingOlustur(args: ZoomMeetingArgs): Promise<ZoomMeetingResult> {
  const token = await zoomAccessToken();
  const res = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: args.topic,
      type: 2, // scheduled
      start_time: args.startTime,
      timezone: 'Europe/Istanbul',
      settings: { waiting_room: true, join_before_host: false },
    }),
  });
  const body = await res.text();
  if (!res.ok) {
    const kind: ZoomError['kind'] =
      res.status === 403 ? 'scope' : res.status === 401 ? 'credential' : 'other';
    throw new ZoomError(res.status, body, kind);
  }
  const json = JSON.parse(body) as { id: number; join_url: string };
  return { join_url: json.join_url, meeting_id: json.id };
}
