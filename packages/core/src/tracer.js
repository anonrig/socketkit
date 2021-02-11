import tracer from 'dd-trace'
tracer.init({
  profiling: true,
})
export default tracer
