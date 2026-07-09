//This component is used to test the error boundary by intentionally throwing an error when rendered.
export default function TestCrash() {
  return <div>{undefined.value}</div>
}