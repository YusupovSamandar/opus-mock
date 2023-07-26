import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex p-4">
      <div className='pending-section'>
        <div className='section-title flex'>
          Pending Candidates <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

        </div>
        <div className='each-queue flex'>
          <div>fsdf</div>
          <div>fsdf</div>
        </div>
        <div className='each-queue flex'>
          <div>fsdf</div>
          <div>fsdf</div>
        </div>
      </div>
      <div className='ready-section'>
        <div className='section-title flex'>
          Called Candidates <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>

        </div>
        <div className='each-queue flex'>
          <div>fsdf</div>
          <div>fsdf</div>
        </div>
        <div className='each-queue flex'>
          <div>fsdf</div>
          <div>fsdf</div>
        </div>
      </div>
    </main>
  )
}


