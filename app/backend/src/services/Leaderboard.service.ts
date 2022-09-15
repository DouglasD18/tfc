import Matches from '../database/models/matches';
import Teams from '../database/models/teams';
import { IMatch, ITeamClassification } from '../interfaces';

type goalsObject = {
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
};

class LeaderboardService {
  static calcPoints(matches: IMatch[], id: number, isHome: boolean): number {
    let totalPoints = 0;
    matches.forEach((match) => {
      const result = match.homeTeamGoals - match.awayTeamGoals;
      if (match.homeTeam === id && isHome) {
        if (result > 0) {
          totalPoints += 3;
        } if (result === 0) {
          totalPoints += 1;
        }
      } if (match.awayTeam === id && !isHome) {
        if (result < 0) {
          totalPoints += 3;
        } if (result === 0) {
          totalPoints += 1;
        }
      }
    });
    return totalPoints;
  }

  static calcPercent(totalGames: number, totalPoints: number): number {
    const percent = (totalPoints / (totalGames * 3)) * 100;
    return Number(percent.toFixed(2));
  }

  static calcGoalsdifferenc(matches: IMatch[], id: number, isHome: boolean): goalsObject {
    let goalsFavor = 0;
    let goalsOwn = 0;
    matches.forEach((match) => {
      if (match.homeTeam === id && isHome) {
        goalsFavor += match.homeTeamGoals;
        goalsOwn += match.awayTeamGoals;
      } if (match.awayTeam === id && !isHome) {
        goalsFavor += match.awayTeamGoals;
        goalsOwn += match.homeTeamGoals;
      }
    });
    const goalsBalance = goalsFavor - goalsOwn;
    return { goalsBalance, goalsFavor, goalsOwn };
  }

  static calcWins(matches: IMatch[], id: number, isHome: boolean): number {
    let wins = 0;
    matches.forEach((match) => {
      const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = match;
      if (homeTeam === id && homeTeamGoals > awayTeamGoals && isHome) {
        wins += 1;
      } if (awayTeam === id && homeTeamGoals < awayTeamGoals && !isHome) {
        wins += 1;
      }
    });
    return wins;
  }

  static calcDraws(matches: IMatch[], id: number, isHome: boolean): number {
    let draws = 0;
    matches.forEach((match) => {
      const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = match;
      if (homeTeamGoals === awayTeamGoals && homeTeam === id && isHome) {
        draws += 1;
      } if (homeTeamGoals === awayTeamGoals && awayTeam === id && !isHome) {
        draws += 1;
      }
    });
    return draws;
  }

  static calcLosses(matches: IMatch[], id: number, isHome: boolean): number {
    let losses = 0;
    matches.forEach((match) => {
      const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = match;
      if (homeTeam === id && homeTeamGoals < awayTeamGoals && isHome) {
        losses += 1;
      } if (awayTeam === id && homeTeamGoals > awayTeamGoals && !isHome) {
        losses += 1;
      }
    });
    return losses;
  }

  static calcTotalGames(matches: IMatch[], id: number, isHome: boolean): number {
    let totalMatches = 0;
    matches.forEach((match) => {
      if (match.homeTeam === id && isHome) {
        totalMatches += 1;
      }
      if (match.awayTeam === id && !isHome) {
        totalMatches += 1;
      }
    });
    return totalMatches;
  }

  static async createTeamObject(matches: IMatch[], id: number, isHome: boolean):
  Promise<ITeamClassification> {
    const team = await Teams.findOne({ where: { id } });
    const name = team?.teamName;
    const totalPoints = this.calcPoints(matches, id, isHome);
    const totalGames = this.calcTotalGames(matches, id, isHome);
    const totalVictories = this.calcWins(matches, id, isHome);
    const totalDraws = this.calcDraws(matches, id, isHome);
    const totalLosses = this.calcLosses(matches, id, isHome);
    const { goalsFavor, goalsBalance, goalsOwn } = this.calcGoalsdifferenc(matches, id, isHome);
    const efficiency = this.calcPercent(totalGames, totalPoints);
    const firts = { name, totalPoints, totalGames, totalVictories, totalDraws };
    const second = { totalLosses, goalsFavor, goalsOwn, goalsBalance, efficiency };
    return { ...firts, ...second } as ITeamClassification;
  }

  static sortClassification(classification: ITeamClassification[]): ITeamClassification[] {
    const sorted = classification.sort((home, away) => away.totalPoints - home.totalPoints
    || away.totalVictories - home.totalVictories
    || away.goalsBalance - home.goalsBalance
    || away.goalsFavor - home.goalsFavor
    || home.goalsOwn - away.goalsOwn);
    return sorted;
  }

  static async classification(isHome: boolean): Promise<ITeamClassification[]> {
    const teams = await Teams.findAll();
    const matches = await Matches.findAll({ where: { inProgress: false } });
    const classification = await Promise.all(teams.map(async (team) => {
      const teamObject = await this.createTeamObject(matches, team.id, isHome);
      return teamObject;
    }));
    const sortedClassification = this.sortClassification(classification);
    return sortedClassification;
  }
}

export default LeaderboardService;
