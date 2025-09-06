import * as React from "react"
import ErrorFallback from "@/components/layout/ErrorFallback"

type Props = {
    children: React.ReactNode
}

type State = {
    hasError: boolean
    error: any
}

export default class AppErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error }
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error("❌ Caught by AppErrorBoundary:", error, errorInfo)
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null })
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />
        }

        return this.props.children
    }
}
