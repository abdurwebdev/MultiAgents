import redisClient from "../config/redis.js";

const keyFor = (conversationId) => `convo:${conversationId}:msgs`;

export const pushMessage = async (conversationId, message) => {
  const key = keyFor(conversationId);
  // newest messages at head
  await redisClient.lPush(key, JSON.stringify(message));
  // keep only latest 20
  await redisClient.lTrim(key, 0, 19);
};

export const getLastMessages = async (conversationId) => {
  const key = keyFor(conversationId);
  const items = await redisClient.lRange(key, 0, 19); // newest -> oldest
  // return oldest -> newest
  return items.reverse().map((s) => JSON.parse(s));
};
