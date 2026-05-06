import RunwayML from "@runwayml/sdk";

export const maxDuration = 30;

const AVATAR_ID = "55798887-ab64-47ac-ace3-93801f623427";
const POLL_INTERVAL_MS = 1000;
const POLL_MAX_ATTEMPTS = 30;

export async function POST() {
  if (!process.env.RUNWAYML_API_SECRET) {
    return Response.json({ error: "RUNWAYML_API_SECRET not configured" }, { status: 500 });
  }

  const client = new RunwayML();

  const { id: sessionId } = await client.realtimeSessions.create({
    model: "gwm1_avatars",
    avatar: { type: "custom", avatarId: AVATAR_ID },
  });

  let sessionKey: string | null = null;

  for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    const session = await client.realtimeSessions.retrieve(sessionId);

    if (session.status === "READY") {
      sessionKey = session.sessionKey;
      break;
    }
    if (session.status === "FAILED" || session.status === "CANCELLED") {
      return Response.json(
        { error: `Session ${session.status.toLowerCase()}` },
        { status: 502 }
      );
    }
  }

  if (!sessionKey) {
    return Response.json({ error: "Session timed out waiting for READY" }, { status: 504 });
  }

  const consumeRes = await fetch(
    `https://api.dev.runwayml.com/v1/realtime_sessions/${sessionId}/consume`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!consumeRes.ok) {
    const body = await consumeRes.text();
    return Response.json(
      { error: `Consume failed: ${body}` },
      { status: consumeRes.status }
    );
  }

  const { url, token, roomName } = await consumeRes.json();

  return Response.json({ sessionId, serverUrl: url, token, roomName });
}
