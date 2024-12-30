"use client"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignatureInput from '@/components/ui/signature-input'
import {
  useRef
} from "react"

export default function DialogDemo() {
  const canvasRef = useRef(null)
  return (
    <div className="flex items-center justify-center h-screen">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-black text-white">Intra in cont</Button>
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
              aria-hidden="true"
            >
              <svg
                className="stroke-zinc-800 dark:stroke-zinc-100"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
              <DialogDescription className="sm:text-center">
                Enter your credentials to login to your account.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cnm-input">
                  CNM <span className="text-destructive">*</span>
                </Label>
                <Input id="cnm-input" placeholder="CNM" type="text" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serie-input">
                  Serie <span className="text-destructive">*</span>
                </Label>
                <Input id="serie-input" placeholder="Serie" type="text" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numar-input">
                  Număr <span className="text-destructive">*</span>
                </Label>
                <Input id="numar-input" placeholder="Număr" type="text" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nume-input">
                  Nume <span className="text-destructive">*</span>
                </Label>
                <Input id="nume-input" placeholder="Nume" type="text" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenume-input">
                  Prenume <span className="text-destructive">*</span>
                </Label>
                <Input id="prenume-input" placeholder="Prenume" type="text" required />
              </div>
              <div className="space-y-2">
      <Label htmlFor="input-30">File input</Label>
      <Input id="input-30" className="p-0 pe-3 file:me-3 file:border-0 file:border-e" type="file" />
    </div>
              <SignatureInput
                canvasRef={canvasRef}
                onSignatureChange={(signature) => { console.log(signature) }}
              />
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>

        </DialogContent>
      </Dialog>
    </div>
  );
}
