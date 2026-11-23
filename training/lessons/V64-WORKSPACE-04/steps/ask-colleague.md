Open Colleague and ask it, in your own words:

> Tell me when my practice app is running on Staging.

Colleague starts a **watch** on your practice app's Staging. It checks
Staging for you and speaks up when the app is running there. It publishes nothing
itself: watching never changes your app.

```beats
do colleague: Open Colleague.
check done: Press Done once you have asked Colleague to tell you when your app is running on Staging.
```
