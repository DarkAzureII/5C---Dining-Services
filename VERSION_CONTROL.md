# Version Control Guidelines


.

## Tagging and Releases

- **Tag Format**: `vX.Y.Z`
- **X**: Major version (breaking changes)
- **Y**: Minor version (new features, non-breaking changes)
- **Z**: Patch version (bug fixes)

- **Creating a Tag**:
```bash
git tag -a vX.Y.Z -m "Release version X.Y.Z"
git push origin vX.Y.Z
