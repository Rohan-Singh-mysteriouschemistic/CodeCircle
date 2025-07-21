import Contest from "../models/Contest.js";
import User from "../models/User.js";

export async function finishContest(contestId) {
  const contest = await Contest.findById(contestId).populate("participants.user");
  if (!contest) return;

  // sort by solved problems (desc)
  const sorted = contest.participants.sort((a, b) => b.solved - a.solved);

  const first = sorted[0];
  const second = sorted[1];

  if (first?.user?._id) {
    await User.findByIdAndUpdate(first.user._id, { $inc: { "badges.winner": 1 } });
  }
  if (second?.user?._id) {
    await User.findByIdAndUpdate(second.user._id, { $inc: { "badges.second": 1 } });
  }

  // Save ranks if you want
  contest.participants.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  await contest.save();
  console.log(`✅ Contest ${contestId} finished. Badges updated.`);
}
