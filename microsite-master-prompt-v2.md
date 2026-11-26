# MASTER PROMPT: SPECIALTY DOCTOR MICROSITE GENERATION

## Configuration — only three inputs

- `<specialty>` = [MEDICAL SPECIALTY]
- `<male>` = [MALE DOCTOR COUNT]
- `<female>` = [FEMALE DOCTOR COUNT]

## Batch instructions

Create exactly `<male>` male doctor microsites and `<female>` female doctor microsites for `<specialty>`.

- Validate that both counts are non-negative integers and their sum is positive. Automatically calculate `<total-microsites>` as `<male>` + `<female>`.
- Automatically identify the correct specialty folder from the existing project structure and follow its naming convention. Do not require additional configuration. If the specialty folder cannot be identified unambiguously, report the blocker rather than writing into an unrelated folder.
- Inspect existing microsites **only for functional logic, integrations, required content structure, parameterization, project architecture and naming conventions**. Existing microsites are not design references.
- Develop every visual concept independently from scratch. Do not borrow, adapt, reproduce or use existing microsite designs as a starting point, including their layouts, styling, visual components, typography, colour palettes, imagery or hero treatments. Preserve required functionality and functional contracts exactly.
- Compare existing designs only to detect and avoid visual duplication, never for design inspiration.
- Assign `<microsite-name>` automatically for each new site using the naming convention and next available unique name. Never overwrite an existing microsite.
- Assign `<gender>` automatically for each site according to the configured counts.
- Resolve `<template-name>` from the actual template associated with the new microsite according to existing project conventions.
- Maintain a batch inventory of names, genders and visual directions to prevent duplication and verify the final counts.
- Complete Steps 1–3 for each microsite before proceeding to the next.
- Do not leave unresolved master-prompt placeholders in generated microsites. Preserve the project's intended runtime parameterization placeholders.

## Step 1: Create a New Specialty Microsite

Create a new microsite for `<specialty>` named `<microsite-name>`. Create this microsite for a `<gender>` doctor, ensuring that all text, images, and visual elements are appropriate for the specified gender.

- Follow `agents.md` and the existing project architecture.
- Create a **unique, ultra-premium, modern visual identity** for every microsite. Each microsite must feel individually designed and should look like a high-end healthcare brand website rather than a modified version of another template.
- The **most important requirement is that the website must look professional and appropriate for doctors**. Creativity, visual experimentation, and uniqueness must never compromise medical professionalism, trust, credibility, readability, or usability.
- The overall design must feel **current, sophisticated, polished, premium, trustworthy, and visually distinctive**, with the quality level of a modern international healthcare website.
- The design must strongly reflect the **specialty flavour**. The specialty should influence the visual language, imagery, typography, colour palette, shapes, backgrounds, decorative elements, section composition, and overall atmosphere.
- Do not simply add specialty-related icons or images. The specialty should naturally influence the **complete design language** of the microsite.
- Every microsite must have a **different overall visual personality**.
- Do not reuse the same layout, visual composition, colour combination, typography pairing, card style, hero treatment, section arrangement, decorative language, portrait treatment, or interaction style across microsites.
- The microsites must be **genuinely different from one another**, not merely different in colour or imagery.
- A new microsite should feel like a completely new design direction while still belonging to the same premium healthcare product ecosystem.
- Use your creativity to explore different premium design approaches where appropriate. These are **optional design directions, not mandatory styles**. Choose whichever direction best suits the particular doctor and specialty:
  - editorial healthcare design
  - modern luxury clinic design
  - sophisticated wellness design
  - contemporary medical technology aesthetics
  - organic/natural design
  - architectural layouts
  - asymmetric compositions
  - layered compositions
  - immersive imagery
  - refined minimalism
  - sophisticated clinical design
  - premium lifestyle-healthcare design
  - modern heritage-inspired design
  - other appropriate premium design directions
- Do not force these styles if they do not suit the doctor or specialty.
- Maintain strong usability and professionalism regardless of the creative direction.
- The website should always feel **“for doctors” first and creatively designed second**.
- Avoid making the designs unnecessarily decorative. Every visual element should have a clear design purpose.
- Use a **premium design system** with carefully considered typography, spacing, hierarchy, imagery, surfaces, borders, shadows, shapes, and micro-interactions.
- Use sophisticated typography combinations. Do not use the same font combination repeatedly across microsites.
- Use different heading treatments and typographic hierarchies where appropriate.
- Use distinctive but professional colour palettes. Do not default to the same medical blue/green palette for every microsite.
- Colours should complement the specialty and create a sense of **trust, expertise, calmness, premium care, and medical credibility**.
- Use subtle gradients, depth, shadows, layered surfaces, sophisticated borders, soft textures, organic shapes, or restrained 3D effects where they genuinely improve the design.
- Do not overuse gradients, glassmorphism, rounded cards, pills, shadows, or floating elements.
- Avoid generic hospital website aesthetics.
- Avoid anything that looks outdated, generic, repetitive, template-based, childish, overly decorative, or obviously AI-generated.
- Each section can have a **different design treatment**, provided that all sections combine harmoniously into one cohesive microsite.
- Do not force every section to use the same card style, background, layout, or component structure.
- A microsite may use an editorial About section, an image-led Services section, a more structured Credentials section, and an immersive Appointment section, for example, as long as they collectively feel like one professionally art-directed website.
- Use different section layouts, content widths, image treatments, spacing patterns, background treatments, visual transitions, and component styles where appropriate.
- Maintain a clear visual hierarchy so that the website remains easy to scan and professional.
- Use high-quality, free-to-use images with verified licensing or generate appropriate and relevant images as needed.
- All images except gallery images must be **unique to each microsite**. Do not reuse the same hero, service, treatment, testimonial, clinic, lifestyle, or supporting images across microsites.
- Images should feel realistic, natural, premium, professionally photographed, and relevant to the specialty.
- Avoid generic stock-photo aesthetics wherever possible.
- Generated images should not look obviously AI-generated.
- Ensure doctor portraits look natural, professional, realistic, and appropriate for the doctor's gender and specialty.
- The doctor's portrait must be **large and visually prominent**, especially in the hero section. Do not use a small doctor portrait that makes the doctor feel secondary to the background.
- The portrait should occupy a meaningful amount of the hero's visual space while maintaining a balanced composition.
- Ensure all sections, components, interactions, and responsiveness work correctly across mobile, tablet, and desktop.
- Fix all visual issues, broken elements, and console errors.
- All the pages of the microsite should have the same footer.


### Hero Section

- Every microsite must have a **distinctive, premium hero section**.
- The hero section should use an appropriate, high-quality specialty-related image as the **background**.
- The background image should visually transition/fade from one side to another.
- The faded/controlled side of the hero should contain the doctor's details, while the more visible image area should contain the doctor's **large, prominent portrait** in the foreground.
- The doctor's portrait should be one of the main visual focal points of the hero.
- Do not make the doctor's portrait small simply to accommodate decorative background imagery.
- The portrait should appear naturally integrated into the hero composition rather than looking like a generic rectangular image placed on top.
- Maintain strong visual hierarchy between the doctor's name, qualifications, specialty, description, and CTA.
- The hero should feel immersive and premium while remaining highly readable.
- Do not use the same hero composition for every microsite.
- Vary the direction of the fade, image positioning, typography placement, spacing, background treatment, decorative elements, portrait composition, and portrait framing between microsites while preserving the required hero concept.
- The hero background and portrait must work together as one visual composition.
- Ensure the doctor's portrait remains clearly visible and professionally presented on desktop, tablet, and mobile.
- On smaller screens, restructure the hero when necessary rather than simply shrinking the desktop version.


### Doctor Portrait Containers

- Each microsite must use a **different portrait container treatment/shape**.
- Do not use the same circular portrait treatment for every microsite.
- The portrait container should be **large, visually prominent, elegant, and appropriate for a professional doctor website**.
- Explore different premium shapes such as:
  - circle
  - rounded rectangle
  - arch
  - soft organic shape
  - asymmetric frame
  - editorial cutout
  - layered frame
  - capsule-inspired frame
  - geometric frame
  - specialty-inspired organic silhouette
  - other elegant custom shapes
- These are optional design directions. Use whichever shape best fits the particular microsite.
- The portrait container should complement the overall design direction of that specific microsite.
- Do not make the shapes overly decorative or gimmicky.
- Ensure the doctor's face and body remain naturally positioned and are never awkwardly cropped.
- Do not allow the portrait framing to overpower the doctor or make the website feel like a fashion/lifestyle website rather than a medical professional website.


### Specialty Visual Language

For every microsite, establish a clear **specialty-specific design language** before designing the sections.

The specialty should influence:

- Colour palette
- Typography
- Hero imagery
- Background imagery
- Graphic motifs
- Shapes
- Image treatments
- Section compositions
- Iconography
- Decorative elements
- Animation style
- Content presentation
- Overall mood

For `<specialty>` specifically, independently derive appropriate specialty-specific visual cues for a sophisticated, medically appropriate visual language.

Automatically derive appropriate design restrictions from the specialty and medical professionalism requirements, without using existing microsite designs as inspiration.

Avoid clichéd, overly literal, or commercially inappropriate interpretations of the specialty. The goal is **modern premium `<specialty>` healthcare**, combining contemporary healthcare design with subtle specialty-specific visual cues. The identity must feel appropriate for a **qualified medical professional**, not an unrelated lifestyle, retail, or wellness brand.


### Visual Variety Across Microsites

Before creating each microsite, intentionally choose a different visual direction.

Do not create all `<total-microsites>` sites sequentially using the same design system.

Across the `<total-microsites>` microsites, vary:

- Primary and secondary colour palettes
- Typography combinations
- Hero composition
- Hero background treatment
- Portrait shape
- Portrait placement
- Portrait framing
- Section ordering where appropriate
- Section layouts
- Content alignment
- Image placement
- Card treatments
- Border styles
- Corner-radius language
- Background treatments
- Decorative motifs
- Button styles
- Navigation treatment
- Testimonial presentation
- Service presentation
- About section composition
- Appointment section composition
- Gallery presentation
- Animation and transition styles

The sites must be **visibly and unmistakably different when viewed side-by-side**.

Do not make only superficial changes such as changing the primary colour or swapping images.

Each microsite should have its own **visual design story**, while remaining recognizably part of a professional doctor-microsite product.


### Micro-Animations & Interactions

Every microsite should be checked for appropriate **micro-animations and interactive behaviour**.

Use subtle, premium interactions where they improve the user experience, such as:

- smooth hover states
- button interactions
- image hover effects
- subtle card transitions
- scroll reveal animations
- gentle section entrance animations
- navigation transitions
- image movement/parallax where appropriate
- accordion interactions
- testimonial transitions
- tab interactions
- subtle appointment UI transitions
- smooth modal transitions
- refined loading states

Animations should feel **smooth, modern, subtle, and intentional**.

Do not add animation merely for decoration.

Avoid:
- excessive bouncing
- flashy effects
- distracting motion
- excessive parallax
- slow transitions
- animations that interfere with reading
- animations that negatively affect mobile performance
- animation on every single element

After development, **actively check whether the microsite actually contains meaningful micro-interactions**. If the design feels completely static where interaction would improve the experience, add appropriate subtle interactions.

Ensure animations work correctly across desktop and mobile and respect usability/accessibility considerations.


### Premium Design Quality

Every microsite should pass this visual quality test:

**If the doctor name, specialty, and images were removed, the design should still look like a professionally art-directed premium healthcare website.**

More importantly:

**When the doctor name, portrait, specialty, qualifications, and content are added back, the website must immediately feel like a premium digital presence created specifically for a doctor.**

The final result should communicate:

**Trust + Expertise + Professionalism + Premium Care + Modern Healthcare + Specialty Identity**

The website should feel like it was designed specifically for that doctor rather than generated from a generic template.

**Professionalism for doctors is the primary design requirement.**

Creativity and uniqueness should enhance that professionalism, never compete with it.


### Responsive Design

The desktop, tablet, and mobile versions must each be intentionally designed.

Do not simply scale down the desktop layout.

On mobile:

- Preserve the premium visual hierarchy.
- Ensure the hero composition remains visually strong.
- Reposition or restructure hero imagery when necessary.
- Ensure the doctor portrait remains sufficiently large and prominent.
- Ensure doctor portraits are not awkwardly cropped.
- Maintain comfortable spacing and typography.
- Ensure buttons and interactive elements are easy to use.
- Ensure appointment booking is easy and prominent.
- Preserve the specialty-specific visual identity.
- Avoid excessive vertical spacing or unnecessary visual clutter.
- Ensure all animations and interactions remain smooth and usable.
- Ensure the website still feels premium and professional rather than looking like a compressed desktop layout.


## Step 2: Verify the Microsite

- Follow `verification.md` to verify all elements and functionality.
- Test navigation, forms, social media sections, Facebook widgets, banners, and other integrations.
- Visually inspect the booking system flow, chatbot window for layout, spacing, usability, icons, text sizing and responsiveness.
- Fix identified issues and re-verify the affected elements.
- Have a look over the whole microsite once it is done and check for any layout issue that does not look good and looks odd then fix those.
- Perform a final visual quality check specifically for:
  - professional doctor-focused appearance
  - visual consistency
  - premium appearance
  - specialty flavour
  - typography
  - spacing
  - image quality
  - image uniqueness
  - hero composition
  - portrait size
  - portrait container shape
  - mobile responsiveness
  - section transitions
  - visual hierarchy
  - alignment
  - CTA visibility
  - micro-animations
  - interactive states
  - accessibility
  - broken assets
  - console errors
- Check that the doctor's portrait is **large enough to be a major visual element** and has not become too small due to other hero elements.
- Check that the website contains appropriate micro-interactions and that they work correctly.
- Compare the completed microsite against the previously generated microsites and ensure it does **not** look like a visual duplicate of them.
- Check the microsite section-by-section. Individual sections are allowed to have different visual treatments, but they must combine into a **cohesive, professional doctor website**.
- If any section feels visually disconnected, amateur, generic, or inconsistent with the overall doctor-focused experience, redesign it.
- If it looks too similar to an existing microsite, redesign the visually repetitive parts before proceeding.


## Step 3: Parameterize and Smoke-Test

Parameterize `<template-name>` according to `parameterization.md`.

- Ensure all required content, branding, banners, and settings are configurable and working correctly.
- Smoke-test the microsite along with complete appointment booking flow, including validation, submission, and confirmation modals for both **online and offline bookings**.
- Verify the banner system, Facebook widgets, chatbot, and overall website after parameterization.
- Check responsiveness, console errors, broken assets, and regressions.
- Keep the appointment booking system logic same as the live microsites.


## Generation Rules

- Generate sites **one by one**.
- Do not mass-produce the same visual design and then make minor modifications.
- Before creating each microsite, deliberately establish a **new visual concept**.
- Each completed microsite must be substantially different from the previous microsite in overall visual appearance.
- Do not reuse the same colour palette, typography pairing, hero composition, portrait shape, portrait treatment, or section composition repeatedly.
- All sites must remain **beautiful, professional, premium, functional, and appropriate specifically for doctors**.
- **Professionalism for doctors is the main requirement.**
- Creativity is encouraged, but usability, credibility, readability, and medical professionalism always take priority.
- Do not sacrifice functionality for visual experimentation.
- The final `<total-microsites>` microsites should look like **<total-microsites> individually art-directed premium `<specialty>` doctor brands**, not `<total-microsites>` colour variations of one template.
- Each microsite should be unique enough that when all `<total-microsites>` are opened side-by-side, they clearly look like different designs.
- At the same time, all `<total-microsites>` should maintain the quality and credibility expected from a professional doctor microsite.

Do not change any existing functionality, appointment logic, integrations, parameterization behaviour, or project architecture unless required to fix a genuine issue.

Preserve the existing functionality exactly
