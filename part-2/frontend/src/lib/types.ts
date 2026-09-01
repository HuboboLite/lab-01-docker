export type Task = {
	id: string
	task: string
	completed: boolean
}

export type TaskCreate = {
	task: string
}

export type TaskUpdate = {
	task: string
	completed: boolean
}
