import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function AddNew({ refresh }: { refresh: () => void }) {
  const [account, setAccount] = useState<{
    name: string
    email: string
  }>({
    name: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { toast } = useToast()

  const handleSubmit = async () => {
    console.log(account)
    setLoading(true)
    try {
      if (account.name === '' || account.email === '') {
        throw new Error('Name and Email are required')
      }

      const response = await fetch('/api/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
      })

      if (response.ok) {
        console.log('Account Added')

        toast({
          title: 'Account Added',
          description: `Account ${account.name} has been added successfully`,
        })

        setIsOpen(false)
        refresh()
      } else {
        const data = await response.json()
        throw new Error(data)
      }
    } catch (error: any) {
      console.error(error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'default'}>
          <Plus size={15} />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <h2 className="text-xl font-bold">Add New Account</h2>
          <DialogDescription>
            Enter new account&apos;s name and email.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center flex-col gap-2">
          <div className="grid grid-cols-4 items-center gap-4 w-full">
            <Label htmlFor="accountname" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="James Bond"
              className="col-span-3 bg-white"
              onChange={(e) => {
                setAccount((prev) => ({ ...prev, name: e.target.value }))
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 w-full">
            <Label htmlFor="accountemail" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="agent007@gmail.com"
              className="col-span-3 bg-white"
              onChange={(e) => {
                setAccount((prev) => ({ ...prev, email: e.target.value }))
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'ghost'}>Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            variant={'default'}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
