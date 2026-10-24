# Upload the exact approved 2.35 MB ZIP here to complete Peren Infernal v9.0.

Current PR branch: `feature/peren-v90-infernal-refined`

Upload using GitHub's **Add file → Upload files**, retaining the exact filename:
`Peren_Infernal_v90_GitHub_Ingest.zip`

Only the new refined Infernal is imported. Idle, Void Rift, Summon, portraits, gameplay and saves remain unchanged.

Expected image: `infernal-v90.png`, 2172×724 (4×2 equal 543×362 cells).
Image SHA-256: `b52a89a9737403071c898cfbcec428dbfd892a6e4ebc728f12a573892e785c0a`.
ZIP SHA-256: `ad53107a88c542054bf90e9b85a89819b453f9f20114ed17a876764ff969aa7e`.

The workflow `Peren v9.0 Import Infernal` will verify the complete ZIP and embedded PNG, install `phaser-demo-m1hf/art/battle/runtime-v84/infernal-v90.png`, remove the staging ZIP, and run the new release gate and the normal battle QA. Do not merge until both gates pass.
