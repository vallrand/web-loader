const enum TaskStatus {
    PENDING = 0,
    RESOLVED = 1,
    REJECTED = 2
}

export class AsyncTask<T> implements PromiseLike<T> {
    private _value: T | any
    private _status: TaskStatus = TaskStatus.PENDING
    private readonly _listeners: Array<(this: this) => void> = []

    public resolve = (value: T | PromiseLike<T>): this => this._settle(TaskStatus.RESOLVED, value)
    public reject = (reason: any): this => this._settle(TaskStatus.REJECTED, reason)

    private _propagate(){
        for(let i = 0; i < this._listeners.length; i++)
            this._listeners[i].call(this)
        if(this._status !== TaskStatus.PENDING) this._listeners.length = 0
    }
    private _settle(status: TaskStatus, value: T | any | PromiseLike<T>): this {
        if(this._status !== TaskStatus.PENDING) return this

        if(value && (value as PromiseLike<T>).then){
            (value as PromiseLike<T>).then(this.resolve, this.reject)
            if(value instanceof AsyncTask) this.callback(undefined, value.reject)
        }else{
            this._status = status
            this._value = value
            this._propagate()
        }
        return this
    }

    public then<RT = T, RF = never>(
        onResolve?: (value: T) => RT | PromiseLike<RT>,
        onReject?: (reason: any) => RF | PromiseLike<RF>
    ): AsyncTask<RT | RF> {
        const next = new AsyncTask<RT | RF>()
        next.callback(undefined, this.reject)
        this._listeners.push(function(){
            try{
                if(this._status === TaskStatus.RESOLVED)
                    next.resolve(onResolve ? onResolve(this._value) : this._value)
                else if(this._status === TaskStatus.REJECTED)
                    if(onReject) next.resolve(onReject(this._value))
                    else throw this._value
            }catch(error: any){
                next.reject(error)
            }
        })
        if(this._status !== TaskStatus.PENDING) this._propagate()
        return next
    }

    public catch<RF = T>(onReject: (reason: any) => RF | PromiseLike<RF>): AsyncTask<RF> {
        return this.then(undefined, onReject)
    }

    public callback(resolve?: (value: T) => void, reject?: (reason: any) => void): this {
        this._listeners.push(function(){
            if(this._status === TaskStatus.RESOLVED && resolve)
                resolve(this._value)
            else if(this._status === TaskStatus.REJECTED && reject)
                reject(this._value)
        })
        if(this._status !== TaskStatus.PENDING) this._propagate()
        return this
    }

    public unwrap(suppress?: boolean): T | void {
        if(this._status === TaskStatus.REJECTED && !suppress)
            throw this._value
        else if(this._status === TaskStatus.RESOLVED || suppress)
            return this._value
    }

    public static all<T = any>(list: AsyncTask<T>[]): AsyncTask<T[]> {
        const next = new AsyncTask<T[]>()
        let remaining = list.length
        function listener(this: AsyncTask<T>){
            if(this._status === TaskStatus.REJECTED)
                next.reject(this._value)
            else if(this._status === TaskStatus.RESOLVED && !--remaining)
                next.resolve(list.map(task => task._value))
        }
        list.forEach(function(task: AsyncTask<T>){
            next.callback(undefined, task.reject)
            task._listeners.push(listener)
            if(task._status !== TaskStatus.PENDING) task._propagate()
        })
        return next
    }
}