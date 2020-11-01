import { ILoadContext } from './Loader'

/** @internal */
export const Progress = (
    totalAmount: number,
    updateProgress?: (fraction: number) => void,
    precision: number = 1e3
) => {
    let totalProgress: number = 0
    const progress = Array(totalAmount).fill(0)
    return function(this: ILoadContext, fraction: number){
        const delta = Math.max(0, Math.round(fraction * precision) - progress[this.index])
        progress[this.index] += delta
        totalProgress += delta
        if(updateProgress) updateProgress(totalProgress / precision / progress.length)
    }
}