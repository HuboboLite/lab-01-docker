import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import TodoList from "@/TodoList"
import CreateTodo from "@/CreateTodo"
import { cn } from "@/lib/utils"
const queryClient = new QueryClient()

const App: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<div
				className={cn([
					"w-[100vw]",
					"min-h-[100vh]",
					"bg-slate-50",
					"flex",
					"justify-center",
					"items-start",
					"space-x-8",
					"p-12",
				])}>
				<div className={cn(["sticky", "top-12"])}>
					<h1 className={cn(["text-4xl", "font-bold", "mb-4"])}>Todo List</h1>
					<CreateTodo />
				</div>
				<TodoList />
			</div>
		</QueryClientProvider>
	)
}

export default App
