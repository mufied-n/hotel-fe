import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export function useSectionReveal(target: Readonly<Ref<HTMLElement | null>>) {
  let observer: IntersectionObserver | undefined
  let media: MediaQueryList | undefined

  function reveal() {
    target.value?.classList.add('section-reveal--entered')
    if (target.value) observer?.unobserve(target.value)
  }

  function onMotionPreference(event: MediaQueryListEvent) {
    if (event.matches) {
      reveal()
      observer?.disconnect()
    }
  }

  onMounted(() => {
    const element = target.value
    if (!element) return
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches || !('IntersectionObserver' in window)) { reveal(); return }
    observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) reveal()
    }, { root: null, rootMargin: '0px 0px -24px 0px', threshold: 0 })
    observer.observe(element)
    element.addEventListener('focusin', reveal, { once: true })
    media.addEventListener('change', onMotionPreference)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    media?.removeEventListener('change', onMotionPreference)
  })
}
