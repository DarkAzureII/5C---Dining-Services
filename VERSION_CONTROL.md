# Version Control Guidelines

## Branching Strategy

### Branches

1. **`main` Branch**
   - **Purpose**: Contains the stable, production-ready code.
   - **Usage**: Only merge thoroughly tested code into this branch. Used for releases and deployment.

2. **`develop` Branch**
   - **Purpose**: Integration branch for new features and fixes.
   - **Usage**: Merge feature and bugfix branches here. Merge `develop` into `main` when preparing for a release.

### Branch Creation

1. **Feature Branches**
   - **From**: `develop`
   - **Naming Convention**: `feature/description`
   - **Command**:
     ```bash
     git checkout develop
     git checkout -b feature/your-feature
     ```

2. **Bugfix Branches**
   - **From**: `develop`
   - **Naming Convention**: `bugfix/description`
   - **Command**:
     ```bash
     git checkout develop
     git checkout -b bugfix/your-bugfix
     ```

3. **Hotfix Branches**
   - **From**: `main`
   - **Naming Convention**: `hotfix/description`
   - **Command**:
     ```bash
     git checkout main
     git checkout -b hotfix/your-hotfix
     ```

### Merging Strategy

1. **Feature and Bugfix Merges**
   - **Into**: `develop`
   - **Process**: Test and validate before merging. Use pull requests for reviews.

2. **Release Preparation**
   - **Merge `develop` into**: `main`
   - **Process**: Tag the release and deploy. Ensure `main` is stable.

3. **Hotfix Merges**
   - **Into**: Both `main` and `develop`
   - **Process**: Apply fixes urgently and update both branches.

### Tagging Releases

- **Tag Format**: `vX.Y.Z`
- **Usage**: Tag `main` branch with new versions. Example: `v1.0.0`

### Pull Request Guidelines

- Provide clear descriptions of changes.
- Ensure code meets project standards and passes tests.
- Use pull requests for merging feature, bugfix, and hotfix branches.

For more details on contributing and change tracking, refer to [CONTRIBUTING.md](CONTRIBUTING.md) and [CHANGELOG.md](CHANGELOG.md).

