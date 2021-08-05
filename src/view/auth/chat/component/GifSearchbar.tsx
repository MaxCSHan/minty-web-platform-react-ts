import { useEffect, useState } from 'react'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators'
import { getTrendyGIFs, getSearchGIFs } from '../../../../services/giphyService'

type GifSearchbarProps = {
  sendGIf: (url: string) => void
  setShowGif: (value: boolean) => void
}

const GifSearchbar = ({ sendGIf, setShowGif }: GifSearchbarProps) => {
  const [gifList, setGifList] = useState<string[]>([])

  const keyword$ = new Subject<string>()
  const suggestList$ = keyword$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((ele) => {
      if (ele.replace(/\s/g, '').length === 0) return getTrendyGIFs()
      return getSearchGIFs(ele)
    })
  )
  useEffect(() => {
    const subscription = suggestList$.subscribe((res) => {
        console.log("change")
        const data = res as any;
        setGifList(data.data.map((ele: any) => ele.images.fixed_height.url))
    })
    return () => {
      subscription.unsubscribe()
    }
  })

  useEffect(() => {
    getTrendyGIFs().subscribe((observer) => {
      const data = observer as any
      setGifList(data.data.map((ele: any) => ele.images.fixed_height.url))
    })
  }, [])



  return (
    <div className="flex flex-col w-full overflow-hidden pb-1">
      <div className="flex justify-between">
        <div className="bg-gray-100 rounded-xl px-2 py-1">
          <input
            onChange={(e) => keyword$.next(e.target.value)}
            className="outline-none bg-gray-100 w-64"
            placeholder="Search GIPHY"
          ></input>
        </div>

        <div className="w-6 h-6 px-2 py-3 grid place-content-center rounded-full bg-gray-50 cursor-pointer" onClick={() => setShowGif(false)}>
          <i className="text-gray-300 fas fa-times"></i>
        </div>
      </div>

      <div className="flex  overflow-x-scroll h-36">
        {gifList.map((url) => (
          <img onClick={() => sendGIf(url)} className=" cursor-pointer w-40  object-cover my-1" alt="gif" src={url}></img>
        ))}
      </div>
    </div>
  )
}

export default GifSearchbar
