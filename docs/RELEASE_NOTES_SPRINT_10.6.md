# Sprint 10.6 — Neural portfolio and cross-device sync

## Portfolio milestone

Phase 64 now ends with **Transformer Attention Inspector**, a portfolio project that requires learners to implement:

- explicit token embeddings;
- dot-product attention;
- numerically stable softmax;
- weighted context vectors;
- transparent document ranking;
- honest handling of unknown query/document tokens.

The project includes three reproducible visible test contracts and is gated by normal course progression.

## Cross-device synchronization

The Learning Progress page now reconciles adaptive learning evidence across devices instead of selecting one whole snapshot. Independent attempts and skill evidence are merged and deduplicated.

Additional improvements:

- Realtime subscription for `learning_states`;
- focus and 30-second visible-page reconciliation fallback;
- journey-step progress stored in Supabase;
- optional journal entries hydrated on a second device;
- mini-project planning/code/checkpoints autosaved to the cloud;
- mini-project Realtime updates;
- exam drafts use timestamps so stale cloud data cannot overwrite newer local work;
- language, theme and editor preferences follow the account;
- reset progress includes the new synchronized learning tables.

Run `supabase/cross-device-sync-v2.sql` once after deployment.
