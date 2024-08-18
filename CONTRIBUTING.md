# Contributing to the Dining Services App

We welcome contributions to the Dining Services App project. To ensure a smooth contribution process, please follow these guidelines:

## How to Contribute

1. **Fork the Repository**
    1. Go to the [Dining Services App repository](https://github.com/DarkAzureII/5C---dining-services).
    2. Click on the "Fork" button at the top right corner of the page to create a personal fork of the repository.

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/5C---dining-services.git
   cd 5C---dining-services

3. **Create a Branch**
    For each new feature or bugfix, create a new branch from develop.

    Feature Branch
        ```bash
        git checkout develop
        git checkout -b feature/your-feature

    Bugfix Branch
        ```bash
        git checkout develop
        git checkout -b bugfix/your-bugfix

    Hotfix Branch
        ```bash
        git checkout main
        git checkout -b hotfix/your-hotfix


4. **Make Your Changes**
    Implement your changes according to the project’s guidelines.

5. **Code Style**
- Indentation: Use 2 spaces for indentation.
- Variable Naming: Use camelCase for variables and functions, and PascalCase for classes.
- Line Length: Keep lines under 80 characters.
- Comments: Write clear and concise comments. Use JSDoc for function documentation.

6. ### **Write Tests**
- Unit Tests: Write unit tests for all new features and bug fixes. Ensure coverage is maintained.
- Integration Tests: Test interactions between components where applicable.
- Running Tests: Run tests locally using the following command before pushing:
    ```bash
    npm test

7. ### **Commit Your Changes**
    Write clear, descriptive commit messages and ensure your changes are committed to the correct branch.
    ```bash
    git add .
    git commit -m "Add feature: your-feature"

8. ### **Push to Your Fork**
    Push your branch to your forked repository on GitHub.
    ```bash
    git push origin feature/your-feature

9. ### **Create a Pull Request**
    1. Go to the "Pull Requests" section of the original repository.
    2. Click on "New Pull Request".
    3. Select the branch you pushed from your fork and the develop branch of the main repository.
    4. Provide a descriptive title and summary of your changes.
    5. In the description, include:
        - A summary of what was changed.
        - Any relevant links or references.
        - Steps to test your changes if applicable.
    6. Submit the pull request for review.

### Code Review Process
- Review: All pull requests will be reviewed by project maintainers.
- Feedback: You may receive feedback and requests for changes before your pull request is merged.
- Approval: Once approved, your changes will be merged into the develop branch.

### Reporting Issues
If you encounter bugs or have feature requests:

1. Go to the "Issues" section of the repository.
2. Click on "New Issue".
3. Provide detailed information about the issue or feature request, including steps to reproduce and screenshots if applicable.

### Project Guidelines
- Branching: Follow the branching strategy for creating and managing branches.
- Releases: Refer to the changelog for information on current and past releases.

Thank you for contributing to the Dining Services App!

