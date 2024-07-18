import { updateLeagueAttributes, updateUserAttributes } from "../lib/appwrite";
import { useLineupCache } from "../context/lineupContext";

// Function to determine rank category based on total points
const getRankCategory = (totalPoints) => {
    if (totalPoints >= 75000) return 'Legend';
    if (totalPoints >= 60000) return 'HOF';
    if (totalPoints >= 40000) return 'All-Pro';
    if (totalPoints >= 30000) return 'Pro';
    if (totalPoints >= 20000) return 'Varsity';
    if (totalPoints >= 10000) return 'JV';
    return 'Freshman';
};


const UpdateUserStats = async (user, setUser, league, setLeague, weekNum, lineupCache) => {
    console.log("Start!");

    //const currentWeekPicks = lineupCache[weekNum] || [];
    //console.log(currentWeekPicks)



    // Calculate totalPoints as the sum of potential-points of all entries in lineupCache
    const totalPoints = Object.values(lineupCache).flat().reduce((sum, lineup) => {
        if (lineup.status === "won") {
            return sum + lineup["potential-points"];
        }
        return sum;
    }, 0);

    // Calculate weekPoints as the sum of potential-points of the specified week's entries in lineupCache
    const weekPoints = (lineupCache[weekNum] || []).reduce((sum, lineup) => {
        if (lineup.status === "won") {
            return sum + lineup["potential-points"];
        }
        return sum;
    }, 0);

    const userAttributes = {
        totalPoints: totalPoints,
        weekPoints: weekPoints,
        rankCategory: getRankCategory(totalPoints),
        // leagueRank: calculateLeagueRank(user, weekPoints, league),
        // totalRank: 1, // Example value, adjust as needed
    };
    const updatedUser = await updateUserAttributes(userAttributes);
    setUser(updatedUser);

    const leagueMembers = league.users.map(member =>
        member.username === user.username ? user : member);

    const sortedMembers = [...leagueMembers].sort((a, b) => b.weekPoints - a.weekPoints);
    const contributors = sortedMembers.slice(0, 5);

    const weeklyTotalPoints = contributors.reduce((accumulator, member) => {
        return accumulator + (member.username === user.username ? weekPoints : member.weekPoints);
    }, 0);
    const cumulaticeTotalPoints = contributors.reduce((accumulator, member) => {
        return accumulator + (member.username === user.username ? totalPoints : member.totalPoints);
    }, 0);

    const leagueAttributes = {
        "weekly-total-points": weeklyTotalPoints,
        "cumulative-total-points": cumulaticeTotalPoints,
    };
    const updatedLeague = await updateLeagueAttributes(league, leagueAttributes)


    setLeague(updatedLeague)
    console.log("Done!!");
};

// Export the function to make it available in other files
export { UpdateUserStats };