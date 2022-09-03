import { IMatch } from '../interfaces';

type goalsObject = {
  goalsScored: number,
  goalsConceded: number,
  goalDifference: number,
};

class LeaderboardService {
  static matchPoints(match: IMatch, isHome: boolean): number {
    const { homeTeamGoals, awayTeamGoals } = match;
    const result = homeTeamGoals - awayTeamGoals;
    if (isHome) {
      if (result > 0) {
        return 3;
      } if (result < 0) {
        return 0;
      }
      return 1;
    }
    if (result < 0) {
      return 3;
    } if (result > 0) {
      return 0;
    }
    return 1;
  }

  static calcPoints(matches: IMatch[], id: number): number {
    let totalPoints = 0;
    matches.forEach((match) => {
      let isHome;
      if (match.homeTeam === id) {
        isHome = true;
      } else {
        isHome = false;
      }
      totalPoints += this.matchPoints(match, isHome);
    });
    return totalPoints;
  }

  static calcPercent(matches: IMatch[], totalPoints: number): number {
    const percent = totalPoints / (matches.length * 3) / 100;
    return Number(percent.toFixed(2));
  }

  static calcGoalsdifferenc(matches: IMatch[], id: number): goalsObject {
    let goalsScored = 0;
    let goalsConceded = 0;
    matches.forEach((match) => {
      if (match.homeTeam === id) {
        goalsScored += match.homeTeamGoals;
        goalsConceded += match.awayTeamGoals;
      } else {
        goalsScored += match.awayTeamGoals;
        goalsConceded += match.homeTeamGoals;
      }
    });
    const goalDifference = goalsScored - goalsConceded;
    return { goalDifference, goalsScored, goalsConceded };
  }
}

export default LeaderboardService;
