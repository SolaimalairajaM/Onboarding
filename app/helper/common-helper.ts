import 'mocha'; 
 
export class CommonHelper {
 
    /**
     * Get random string
     * @param length - length of the required string :number
     * @returns - random :string
     */
    getRndString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /**
     * Get random integer between the given range
     * @param min - number
     * @param max - number
     * @returns - random number
     */
    getRndInteger(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getRndFloat(min: number, max: number) {
        var precision = 10000; // 2 decimals
        return Math.floor(Math.random() * (2 * precision - 0 * precision) + 0 * precision) / (1 * precision);
    }

}