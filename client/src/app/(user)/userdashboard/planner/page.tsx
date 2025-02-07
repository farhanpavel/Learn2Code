import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles } from 'lucide-react'
import React from 'react'

const PlannerPage = () => {
  return (
    <div>
      <div className="flex items-center justify-center py-10 flex-col">
        <p className="text-center font-semibold text-teal-700 text-3xl">Generate a Plan</p>
        <div className="flex items-center gap-1 mt-5">
          <Input type="text" placeholder="What do you want to learn?" />
          <Button className='bg-teal-700 hover:bg-teal-800'><Sparkles className='mr-1' size={17}/> Generate</Button>
        </div>
      </div>
    </div>
  )
}

export default PlannerPage