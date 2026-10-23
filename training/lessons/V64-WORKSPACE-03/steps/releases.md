Every deployment is a **release**, listed under **Releases** with its state
and **Logs**. **Restore** puts an earlier release back online in a moment,
without building it again: the quickest way out of a release with a mistake.
Fix the project afterwards and deploy again.

```beats
show deploy-releases: Each deployment is a release. Restore brings an earlier one back.
```
