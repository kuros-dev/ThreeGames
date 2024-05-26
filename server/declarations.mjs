export class Declarations {
    inputs() {
        return {
            W: 0,
            A: 0,
            S: 0,
            D: 0,
            space: false,
            lastSpace: false,
            leftClick: false,
            one: false,
            two: false,
            three: false,
            four: false
        }
    }

    values() {
        return {
            mSens: 0.8,
            move: 0.15,
            enemyMove: {
                raven: 0.04
            },
            fov: 70,
            j_speed: 0.8,
            y_speed: 0
        }
    }
}