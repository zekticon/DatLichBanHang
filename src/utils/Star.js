import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

export const handleAverage = (reviews) => {
    if (reviews && reviews.length > 0) {
        let arr = [];
        reviews.forEach((item) => {
            arr.push(item.rate);

            return arr;
        });
        let sumPoint = arr.reduce((arr, item) => {
            return arr + item;
        });
        return (sumPoint / reviews.length).toFixed(1);
    } else {
        return 0;
    }
};

export const handleStarAverage = (star) => {
    const starS = star;
    const starRound = Math.round(starS);
    let arrStar = [];
    const handleStar = (starRound, starS) => {
        let arr = [];
        for (let i = 1; i <= starRound; i++) {
            arr.push(<StarIcon />);
        }
        if (starRound % starS !== 0) {
            arr.splice(-1, 1, <StarHalfIcon />);
        }
        for (let j = starRound + 1; j < 6; j++) {
            arr.push(<StarBorderIcon />);
        }
        return arr;
    };
    if (starS) {
        switch (starRound) {
            case 1:
                for (let i = 1; i <= starRound; i++) {
                    arrStar.push(<StarIcon />);
                }
                if (starS < 1) {
                    arrStar.splice(0, 1, <StarHalfIcon />);
                }
                for (let j = starRound + 1; j < 6; j++) {
                    arrStar.push(<StarBorderIcon />);
                }
                break;
            case 2:
                arrStar = [...handleStar(starRound, starS)];
                break;
            case 3:
                arrStar = [...handleStar(starRound, starS)];
                break;
            case 4:
                arrStar = [...handleStar(starRound, starS)];
                break;
            case 5:
                arrStar = [...handleStar(starRound, starS)];
                break;
            default:
        }
    }
    return arrStar;
};
