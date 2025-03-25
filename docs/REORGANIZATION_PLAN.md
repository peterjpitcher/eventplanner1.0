# Documentation Reorganization Plan

This document outlines the plan for reorganizing the Event Management System documentation into a more logical structure with five top-level directories.

## New Directory Structure

The documentation has been restructured to have five main categories:

1. **getting-started/**: Everything needed to set up, deploy, and begin using the system
2. **architecture/**: Technical architecture and system design
3. **development/**: Development processes, standards, and guidelines
4. **features/**: Documentation for specific features and components
5. **project-management/**: Project processes, templates, and planning documents

## File Migration Plan

Below is the detailed plan for migrating files to their new locations.

### 1. Getting Started

| Current Location | New Location |
|------------------|--------------|
| `/docs/faq-troubleshooting/` | `/docs/getting-started/faq-troubleshooting/` |
| `/docs/setup/` | `/docs/getting-started/setup/` |
| `/docs/deployment/` | `/docs/getting-started/deployment/` |
| `/docs/getting-started/` | `/docs/getting-started/` |

### 2. Architecture

| Current Location | New Location |
|------------------|--------------|
| `/docs/architecture/` | `/docs/architecture/` |
| `/docs/database/` | `/docs/architecture/database/` |
| `/docs/api/` | `/docs/architecture/api/` |
| `/docs/state-management/` | `/docs/architecture/state-management/` |
| `/docs/security/` | `/docs/architecture/security/` |
| `/docs/performance/` | `/docs/architecture/performance/` |

### 3. Development

| Current Location | New Location |
|------------------|--------------|
| `/docs/coding-standards/` | `/docs/development/coding-standards/` |
| `/docs/naming-standards/` | `/docs/development/naming-standards/` |
| `/docs/testing/` | `/docs/development/testing/` |
| `/docs/error-handling/` | `/docs/development/error-handling/` |
| `/docs/ci-cd/` | `/docs/development/ci-cd/` |
| `/docs/code-review/` | `/docs/development/code-review/` |
| `/docs/development/` | `/docs/development/` |

### 4. Features

| Current Location | New Location |
|------------------|--------------|
| `/docs/components/` | `/docs/features/components/` |
| `/docs/application-definition/` | `/docs/features/application-definition/` |

### 5. Project Management

| Current Location | New Location |
|------------------|--------------|
| `/docs/documentation-standards/` | `/docs/project-management/documentation-standards/` |
| `/docs/templates/` | `/docs/project-management/templates/` |
| `/docs/enhancements/` | `/docs/project-management/enhancements/` |
| `/docs/accessibility/` | `/docs/project-management/accessibility/` |

## Implementation Steps

1. **Create New Structure**: 
   - Five main directories with appropriate subdirectories
   - README.md files for each main directory

2. **Update Index Files**:
   - Update main index.md to reflect new structure
   - Create section-specific index files

3. **Migrate Files**:
   - Copy files to new locations following the migration plan
   - Update internal links in all documents

4. **Clean Up**:
   - Remove old directories once migration is verified
   - Test all links to ensure documentation integrity

## Link Updates

All internal links need to be updated to reflect the new structure. The pattern for updates is:

```markdown
<!-- Old format -->
[Link Text](../old-dir/file.md)

<!-- New format -->
[Link Text](../new-category/subcategory/file.md)
```

## Implementation Note

This reorganization should be done carefully to ensure no documentation is lost and all links remain functional. A phased approach is recommended:

1. Create the new structure and READMEs
2. Migrate files one section at a time
3. Update internal links as each section is migrated
4. Test thoroughly before removing old directories

## Migration Script (Example)

```bash
# Create new structure
mkdir -p docs/{getting-started,architecture,development,features,project-management}

# Copy files with structure preservation
cp -r docs/faq-troubleshooting/ docs/getting-started/
cp -r docs/setup/ docs/getting-started/
# And so on for all directories
``` 