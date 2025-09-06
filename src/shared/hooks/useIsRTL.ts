import * as React from "react"

export function useIsRTL() {
    const [rtl, setRtl] = React.useState(false)
    React.useEffect(() => {
        const el = document?.documentElement
        const update = () => setRtl(el?.getAttribute("dir") === "rtl")
        update()
        const obs = new MutationObserver(update)
        if (el) obs.observe(el, { attributes: true, attributeFilter: ["dir"] })
        return () => obs.disconnect()
    }, [])
    return rtl
}
