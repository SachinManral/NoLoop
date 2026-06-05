# NoLoop Internal Contribution Guide

This document describes how authorized team members and approved
collaborators should contribute to NoLoop.

NoLoop is a private group project. It is not an open-source repository,
and contribution access is managed internally by the NoLoop Project Team.

## Who Can Contribute

The following people may contribute:

- Core members of the NoLoop Project Team
- Approved collaborators invited by the Project Team
- Reviewers or maintainers authorized to work on specific areas

## Contribution Workflow

1. Confirm the scope of the task with the relevant project lead.
2. Create a working branch using the team naming convention.
3. Make focused changes with clear commit messages.
4. Update documentation or tests when your change affects behavior.
5. Submit your branch for internal review.
6. Address feedback before the change is merged.

## Development Expectations

- Keep changes limited to the approved scope.
- Follow the existing project structure and coding style.
- Avoid committing secrets, credentials, or sensitive data (e.g. `GEMINI_API_KEY`, database URIs).
- Validate your changes locally whenever possible.
- Document any operational, security, or compliance impact.
- Never commit real patient data, claim records, or any PHI (Protected Health Information).

## Project Structure Awareness

Contributors should be familiar with the relevant area before making changes:

| Area | Location | Notes |
|---|---|---|
| Frontend dashboards | `frontend/` | Next.js 16, React 19, Tailwind CSS 4 |
| Backend API routes | `backend/app/` | FastAPI, Python |
| AI agents | `backend/agents/` | Extractor, Policy, Investigator, Mediator |
| OCR pipeline | `backend/` | EasyOCR, Tesseract, OpenCV |
| Documentation | `docs/` | Architecture, workflow, compliance, data flow |
| Infrastructure | `docker/` | Redis, Prometheus, Grafana, DB config |

## Reviews

Internal review should check for:

- Functional correctness
- Security and privacy impact
- HIPAA / NHCX compliance considerations
- Test coverage or manual validation
- Documentation updates where needed
- No hardcoded credentials or patient-identifiable data

## Compliance Notes

NoLoop handles sensitive healthcare claims data. All contributors must:

- Follow the guidelines in `docs/hipaa-compliance.md`
- Ensure any new data fields or flows are reviewed for PHI exposure
- Not introduce external data logging without team approval

## Ownership of Contributions

By contributing to NoLoop, you confirm that:

- You are authorized to submit the contribution
- The contribution does not knowingly violate third-party rights
- The NoLoop Project Team may use, modify, and maintain the contribution
  as part of the project

Refer to the `LICENSE` file for the governing project license terms.
