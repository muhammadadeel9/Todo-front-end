import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Edit, Plus, LogOut, CheckCircle2, Circle, ListTodo, Loader2 } from "lucide-react";
import { getTasks } from "@/api/fetchdata";
import axiosInstance from "@/api/axiosinstance";
import { removeToken } from "@/lib/cookieutils";

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingTasks, setFetchingTasks] = useState(true);
  const navigate = useNavigate();

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setFetchingTasks(true);
      const data = await getTasks();
      console.log(data);
      if (data.success) {
        setTasks(data.data || []);
      } else {
        toast.error("Error", {
          description: data.message || "Failed to fetch tasks.",
        });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Error", {
        description: "Failed to fetch tasks. Please try again.",
      });
    } finally {
      setFetchingTasks(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTask) {
        // Update existing task
        const response = await axiosInstance.put(`/tasks/update/${editingTask._id}`, {
          title,
          description,
        });

        if (response?.data?.success) {
          toast.success("Success! ✓", {
            description: "Task updated successfully.",
          });
          fetchTasks();
        }
      } else {
        // Create new task
        const response = await axiosInstance.post("/tasks/create", {
          title,
          description,
        });
        console.log(response);
        if (response.data.success) {
          toast.success("Success! ✓", {
            description: "Task created successfully.",
          });
          fetchTasks();
        }
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Error saving task:", error);
      toast.error("Error", {
        description: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = async (task: Task) => {
    try {
      const response = await axiosInstance.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });

      if (response.data.success) {
        fetchTasks();
        if (!task.completed) {
          toast.success("Task completed! 🎉", {
            description: "Great job!",
          });
        } else {
          toast.info("Task marked incomplete");
        }
      }
    } catch (error: any) {
      console.error("Error toggling task:", error);
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to update task.",
      });
    }
  };

  const deleteTask = async () => {
    console.log(deleteTaskId);
    if (!deleteTaskId) return;

    try {
      const response = await axiosInstance.delete(`/tasks/delete/${deleteTaskId}`);

      if (response.data.success) {
        toast.success("Success!", {
          description: "Task deleted successfully.",
        });
        fetchTasks();
      }
    } catch (error: any) {
      console.error("Error deleting task:", error);
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to delete task.",
      });
    } finally {
      setDeleteTaskId(null);
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingTask(null);
  };

  const handleLogout = () => {
    try {
      removeToken();
      toast.success("Logged out", {
        description: "See you soon! 👋",
      });
      navigate("/signin");
    } catch (error) {
      console.error("Error while logging out:", error);
      toast.error("Error", {
        description: "Failed to log out. Please try again.",
      });
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  // Show loading state while fetching
  if (fetchingTasks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">My Tasks</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {completedCount} of {tasks.length} tasks completed
                  </p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Add Task Button */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="mb-6 w-full md:w-auto shadow-lg" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingTask ? "Edit Task" : "Create New Task"}
              </DialogTitle>
              <DialogDescription>
                {editingTask
                  ? "Update your task details below."
                  : "Add a new task to your list. Fill in the details below."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="mr-2">Saving...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </>
                  ) : editingTask ? (
                    "Update Task"
                  ) : (
                    "Create Task"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <Card className="shadow-lg border-0">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-muted rounded-full mb-4">
                <ListTodo className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-xl font-semibold mb-2">No tasks yet</p>
              <p className="text-muted-foreground mb-6">
                Get started by creating your first task
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task._id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                <CardContent className="flex items-start gap-4 p-5">
                  <button
                    onClick={() => toggleTaskComplete(task)}
                    className="mt-1 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-lg mb-1 ${task.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                        }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(task)}
                      className="hover:bg-primary/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTaskId(task._id)}
                      className="hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={deleteTask} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}