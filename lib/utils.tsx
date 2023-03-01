export const zip = (...rows: any[]) => [...rows[0]].map((_,c) => rows.map(row => row[c]))

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export const shuffleArray = (array: any[]) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}