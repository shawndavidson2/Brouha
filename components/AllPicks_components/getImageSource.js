// utils/getImageSource.js
import images from '../../constants/images';

const teamImageMap = {
    'BAL': images.BAL,
    'KC': images.KC,
    // 'ARI': images.ARI,
    // 'ATL': images.ATL,
    // 'BUF': images.BUF,
    // 'CAR': images.CAR,
    // 'CHI': images.CHI,
    // 'CIN': images.CIN,
    // 'CLE': images.CLE,
    // 'DAL': images.DAL,
    // 'DEN': images.DEN,
    // 'DET': images.DET,
    // 'GB': images.GB,
    // 'HOU': images.HOU,
    // 'IND': images.IND,
    // 'JAX': images.JAX,
    // 'LV': images.LV,
    // 'LAC': images.LAC,
    // 'LAR': images.LAR,
    // 'MIA': images.MIA,
    // 'MIN': images.MIN,
    // 'NE': images.NE,
    // 'NO': images.NO,
    // 'NYG': images.NYG,
    // 'NYJ': images.NYJ,
    // 'PHI': images.PHI,
    // 'PIT': images.PIT,
    // 'SEA': images.SEA,
    // 'SF': images.SF,
    // 'TB': images.TB,
    // 'TEN': images.TEN,
    // 'WAS': images.WAS
};

const getImageSource = (teamName) => {
    return teamImageMap[teamName.trim()] || images.empty;
};

export default getImageSource;
