import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TaskCreate } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const CreateTodo: React.FC = () => {
	const client = useQueryClient()
	const { mutateAsync: createTask } = useMutation({
		mutationFn: async (task: TaskCreate) => {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_BASE_URL}/tasks`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(task),
				}
			)
			const data = await response.json()
			return data as Promise<TaskCreate>
		},
		onSuccess: async () => {
			await client.invalidateQueries({
				queryKey: ["tasks"],
			})
		},
	})

	return (
		<Card className="w-[400px]">
			<CardHeader>
				<CardTitle>Create Task</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={async (event) => {
						event.preventDefault()
						const form = event.currentTarget as HTMLFormElement
						const formData = new FormData(form)
						const task = formData.get("task") as string
						await createTask({ task })

						form.reset()
					}}>
					<div className={cn(["flex", "space-x-4"])}>
						<Input type="text" name="task" required />
						<Button type="submit">Create Task</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}

export default CreateTodo
