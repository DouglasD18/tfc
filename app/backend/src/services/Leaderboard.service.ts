import Matches from '../database/models/matches';
import Teams from '../database/models/teams';
import { IMatch, ITeamClassification } from '../interfaces';

type goalsObject = {
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
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
    let goalsFavor = 0;
    let goalsOwn = 0;
    matches.forEach((match) => {
      if (match.homeTeam === id) {
        goalsFavor += match.homeTeamGoals;
        goalsOwn += match.awayTeamGoals;
      } else {
        goalsFavor += match.awayTeamGoals;
        goalsOwn += match.homeTeamGoals;
      }
    });
    const goalsBalance = goalsFavor - goalsOwn;
    return { goalsBalance, goalsFavor, goalsOwn };
  }

  static calcWins(matches: IMatch[], id: number): number {
    let wins = 0;
    matches.forEach((match) => {
      const { homeTeam, homeTeamGoals, awayTeamGoals } = match;
      if (homeTeam === id && homeTeamGoals > awayTeamGoals) {
        wins += 1;
      } if (homeTeam !== id && homeTeamGoals < awayTeamGoals) {
        wins += 1;
      }
    });
    return wins;
  }

  static calcDraws(matches: IMatch[]): number {
    let draws = 0;
    matches.forEach((match) => {
      const { homeTeamGoals, awayTeamGoals } = match;
      if (homeTeamGoals === awayTeamGoals) {
        draws += 1;
      }
    });
    return draws;
  }

  static calcLosses(matches: IMatch[], id: number): number {
    let losses = 0;
    matches.forEach((match) => {
      const { homeTeam, homeTeamGoals, awayTeamGoals } = match;
      if (homeTeam === id && homeTeamGoals < awayTeamGoals) {
        losses += 1;
      } if (homeTeam !== id && homeTeamGoals > awayTeamGoals) {
        losses += 1;
      }
    });
    return losses;
  }

  static async createTeamObject(matches: IMatch[], id: number): Promise<ITeamClassification> {
    const team = await Teams.findByPk(id);
    const name = team?.teamName;
    const totalPoints = this.calcPoints(matches, id);
    const totalGames = matches.length;
    const totalVictories = this.calcWins(matches, id);
    const totalDraws = this.calcDraws(matches);
    const totalLosses = this.calcLosses(matches, id);
    const { goalsFavor, goalsBalance, goalsOwn } = this.calcGoalsdifferenc(matches, id);
    const efficiency = this.calcPercent(matches, totalPoints);
    const firts = { name, totalPoints, totalGames, totalVictories, totalDraws };
    const second = { totalLosses, goalsFavor, goalsOwn, goalsBalance, efficiency };
    return { ...firts, ...second } as ITeamClassification;
  }

  static sortByPoints(value1: ITeamClassification, value2: ITeamClassification): number {
    if (value1.totalPoints > value2.totalPoints) {
      return 1;
    } if (value1.totalPoints < value2.totalPoints) {
      return -1;
    }
    return 0;
  }

  static sortByWins(value1: ITeamClassification, value2: ITeamClassification): number {
    if (value1.totalVictories > value2.totalVictories) {
      return 1;
    } if (value1.totalVictories < value2.totalVictories) {
      return -1;
    }
    return 0;
  }

  static sortByGoalsBalance(value1: ITeamClassification, value2: ITeamClassification): number {
    if (value1.goalsBalance > value2.goalsBalance) {
      return 1;
    } if (value1.goalsBalance < value2.goalsBalance) {
      return -1;
    }
    return 0;
  }

  static sortByGoalsFavor(value1: ITeamClassification, value2: ITeamClassification): number {
    if (value1.goalsFavor > value2.goalsFavor) {
      return 1;
    } if (value1.goalsFavor < value2.goalsFavor) {
      return -1;
    }
    return 0;
  }

  static sortByGoalsOwn(value1: ITeamClassification, value2: ITeamClassification): number {
    if (value1.goalsOwn > value2.goalsOwn) {
      return -1;
    } if (value1.goalsOwn < value2.goalsOwn) {
      return 1;
    }
    return 0;
  }

  static async classification(): Promise<ITeamClassification[]> {
    const teams = await Teams.findAll();
    const matches = await Matches.findAll();
    const classification = await Promise.all(teams.map(async (team) => {
      const teamObject = await this.createTeamObject(matches, team.id);
      return teamObject;
    }));
    classification.sort(this.sortByPoints);
    classification.sort(this.sortByWins);
    classification.sort(this.sortByGoalsBalance);
    classification.sort(this.sortByGoalsFavor);
    classification.sort(this.sortByGoalsOwn);
    return classification;
  }
}

export default LeaderboardService;
