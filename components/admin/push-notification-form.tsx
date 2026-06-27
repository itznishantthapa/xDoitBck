"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const fieldClassName = cn(
  "rounded-xl border-0 bg-background text-sm font-medium shadow-none ring-1 ring-foreground/10",
  "placeholder:text-muted-foreground focus-visible:border-0 focus-visible:ring-1 focus-visible:ring-foreground/20"
);

export function PushNotificationForm() {
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log({
      topic: topic.trim(),
      title: title.trim(),
      message: message.trim(),
    });
  };

  return (
    <Card className="flex min-h-0 flex-1 flex-col pt-0">
      <CardHeader className="shrink-0 space-y-0 border-b py-4">
        <CardTitle className="text-base">Send Push Notification</CardTitle>
        <CardDescription>
          Broadcast a notification to users subscribed to a topic
        </CardDescription>
      </CardHeader>

      <CardContent className="py-6">
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl flex-col gap-5">
          <div className="grid gap-2">
            <label htmlFor="topic" className="text-sm font-medium">
              Topic name
            </label>
            <Input
              id="topic"
              type="text"
              value={topic}
              placeholder="e.g. all_users"
              onChange={(event) => setTopic(event.target.value)}
              className={cn("h-10", fieldClassName)}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="notification-title" className="text-sm font-medium">
              Notification title
            </label>
            <Input
              id="notification-title"
              type="text"
              value={title}
              placeholder="Enter notification title"
              onChange={(event) => setTitle(event.target.value)}
              className={cn("h-10", fieldClassName)}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="notification-message" className="text-sm font-medium">
              Notification message
            </label>
            <Textarea
              id="notification-message"
              value={message}
              placeholder="Write the notification message..."
              rows={6}
              onChange={(event) => setMessage(event.target.value)}
              className={cn("min-h-32 resize-y", fieldClassName)}
            />
          </div>

          <Button type="submit" className="h-10 w-full rounded-xl sm:w-auto sm:px-8">
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
