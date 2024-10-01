type DropzoneProps = {
  isDragActive: boolean
}
const Dropzone = ({ isDragActive }: DropzoneProps) => {
  if (!isDragActive) return null

  return (
    <div className="absolute inset-0 z-30 bg-gray-400 bg-opacity-20 flex justify-center items-center">
      <div className="text-2xl flex items-center justify-center px-3 py-2">Drop files here</div>
    </div>
  )
}

export default Dropzone
