"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { url } from '@/components/Url/page'
import { Loader2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

export interface Root {
  result: Result[]
}

export interface Result {
  step: string
  difficulty: string
  reference_links: ReferenceLink[]
  
}

export interface ReferenceLink {
  title: string
  url: string
  type: string
  embed_url?: string
}



const PlannerPage = () => {

  const [query, setquery] = useState<string>('')
  const [level, setlevel] = useState<string>('')
  const [loading, setloading] = useState<boolean>(false)  
  const [plan, setplan] = useState<Root>({result: []})

  const generatePlan = () => {
    setloading(true)
    fetch(`${url}/api/planner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, level })
    }).then(res => res.json()).then(data => {
      console.log(data)
      setplan(data)
      setloading(false)
    }).catch(err => {
      console.log(err)
      setloading(false)
    })
  }

  return (
    <div>
      <div className="flex items-center justify-center py-10 flex-col">
        <p className="text-center font-semibold text-teal-700 text-3xl">Generate a Plan</p>
        <div className="flex items-center gap-1 mt-5">
          <Input type="text" placeholder="What do you want to learn?" value={query} onChange={e=> setquery(e.target.value)} />
          <Select onValueChange={setlevel}>
            <SelectTrigger className="w-[180px] border-teal-700">
              <SelectValue placeholder="Current Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Button disabled={loading} onClick={generatePlan} className='bg-teal-700 hover:bg-teal-800'>{loading?<Loader2 className='animate-spin mr-1' size={17} />:<Sparkles className='mr-1' size={17}/>} Generate</Button>
        </div>
        {loading&&<p className='mt-5 text-center text-sm text-teal-500'>Generating a plan for you</p>}
        
        {plan&&plan.result.length>0&&<div className='mt-5'>
          <Accordion type="single" collapsible>
          {plan.result.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className='flex items-center'>
                  <p className='text-sm mr-2'>{item.step}</p>
                  <Badge
                  className={item.difficulty==='Beginner'?'bg-green-500':item.difficulty==='Intermediate'?'bg-yellow-600':'bg-red-500'}
                  >{item.difficulty}</Badge>
                </AccordionTrigger>
                <AccordionContent>
                  {
                    item.reference_links.map((link, i) => (
                       link.type==='video'?
                       <iframe width="688" height="387" src={link.embed_url} title={link.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>:
                        <div className='my-3'><a key={i} href={link.url} target="_blank" className='text-xs w-[400px]' rel="noreferrer"><Badge>Documentation</Badge> {link.title} <span className='unerline italic  text-blue-500'>({link.url})</span></a></div>
                    ))
                  }
                </AccordionContent>
              </AccordionItem>))}
          </Accordion>
          </div>}
          
      </div>
    </div>
  )
}

export default PlannerPage