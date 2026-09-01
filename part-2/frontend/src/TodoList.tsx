import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Task } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const TodoList: React.FC = () => {
	const client = useQueryClient()
	const { data: tasks } = useQuery({
		queryKey: ["tasks"],
		queryFn: async () => {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/tasks`
			)
			const data = await response.json()
			return data as Promise<Task[]>
		},
	})
	const { mutateAsync: updateTask } = useMutation({
		mutationFn: async (task: Task) => {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/tasks/${task.id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(task),
				}
			)
			const data = await response.json()
			return data as Promise<Task>
		},
		onSuccess: async () => {
			await client.invalidateQueries({
				queryKey: ["tasks"],
			})
		},
	})

	const { mutateAsync: deleteTask } = useMutation({
		mutationFn: async (taskId: string) => {
			await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/tasks/${taskId}`, {
				method: "DELETE",
			})
			return
		},
		onSuccess: async () => {
			await client.invalidateQueries({
				queryKey: ["tasks"],
			})
		},
	})

	return (
		<Card className={cn(["w-[400px]"])}>
			<CardContent className={cn(["space-y-2", "pt-6"])}>
				{!tasks ? (
					<div className={cn(["text-center", "text-slate-400"])}>
						Loading...
					</div>
				) : tasks.length <= 0 ? (
					<div className={cn(["text-center", "text-slate-400"])}>No tasks</div>
				) : (
					tasks.map((task) => (
						<div
							key={task.id}
							className={cn([
								"flex",
								"items-center",
								"justify-between",
								"space-x-2",
							])}>
							<div
								className={cn([
									"flex",
									"items-center",
									"justify-between",
									"space-x-2",
								])}>
								<Checkbox
									checked={task.completed}
									onCheckedChange={async (checked) => {
										if (typeof checked === "string") return
										await updateTask({ ...task, completed: checked })
									}}
								/>
								<span>{task.task}</span>
							</div>
							<div>
								<Button variant="outline" onClick={() => deleteTask(task.id)}>
									🗑️
								</Button>
							</div>
						</div>
					))
				)}
			</CardContent>
		</Card>
	)
}

export default TodoList
