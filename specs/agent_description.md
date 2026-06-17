# Agent Icon Focus with Description Panel

## Overview

This feature enhances the accessibility and discoverability of agent information by implementing keyboard-navigable agent icons that display detailed descriptions in an expandable panel when focused. When a user navigates to an agent icon using keyboard tab navigation, an expandable panel will appear below the icon showing the agent's description. The descriptions will be sourced from the README and documentation files in the https://github.com/andrewevans0102/reygent repository.

## Requirements

- Modify agent icon components to be keyboard-focusable (ensure proper `tabindex` or semantic HTML elements)
- Implement focus event handlers on agent icons to detect when keyboard navigation lands on an icon
- Create an expandable description panel component that appears below the focused agent icon
- Extract agent descriptions from the README.md and relevant documentation files in the https://github.com/andrewevans0102/reygent GitHub repository
- Map extracted descriptions to their corresponding agent icons in the application
- Ensure the description panel collapses when focus moves away from the agent icon
- Support standard keyboard navigation patterns (Tab to move forward, Shift+Tab to move backward)
- Ensure visual indication when an agent icon has keyboard focus (focus ring or equivalent)
- Position the expandable panel directly below the focused icon without disrupting the layout of other icons
- Handle edge cases where the panel may extend beyond viewport boundaries (scroll or reposition as needed)

## Acceptance Criteria

- All agent icons are keyboard-accessible via Tab key navigation
- When an agent icon receives keyboard focus, an expandable panel appears below it displaying the agent's description
- The description panel does not appear on mouse hover, only on keyboard focus
- The description text matches the content from the https://github.com/andrewevans0102/reygent repository documentation
- When focus leaves an agent icon (Tab or Shift+Tab to another element), the description panel collapses or is hidden
- The focus indicator (outline/ring) is clearly visible on the focused agent icon
- The expandable panel does not cause layout shift or overlap other interactive elements in a way that breaks functionality
- All agents listed in the interface have corresponding descriptions populated from the GitHub repository
- Navigation order is logical and follows the visual order of agent icons
- The feature works across modern browsers (Chrome, Firefox, Safari, Edge)

## Constraints

- Descriptions must be fetched from https://github.com/andrewevans0102/reygent and cannot be manually authored or duplicated
- The implementation must use keyboard tab/focus navigation exclusively (no mouse hover behavior for description display)
- The expandable panel must render below the icon to maintain a consistent spatial relationship
- Changes must not break existing agent selection or interaction workflows
- The solution should be implemented in the existing component architecture at github.com/andrewevans0102/reygent
- Accessibility standards (WCAG 2.1 AA minimum) must be maintained, including proper ARIA attributes if custom components are used
- The feature must not introduce performance degradation when navigating through multiple agent icons