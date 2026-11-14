A published app doesn't change by itself when you change the project. You
change the project, save, and publish a **new release**.

1. Ask the coding chat to change the sign, for example to say you are closed
   on Sundays.
2. Check the new sign in Preview, then **Save**. Only saved work is published.
3. In Staging, press **Publish to staging**, then **Publish**.

This step uses your AI. If it isn't answering, read on: the next steps work
without it.

```beats
do send-message: "Change the sign's message to say we are closed on Sundays."
do agent-finished: Wait while the agent works.
do save: Save your change.
do app-deployed: Open Staging, press Publish to staging, then Publish.
check done: Press Done when the new sign is online.
```
