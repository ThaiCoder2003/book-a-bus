import React from 'react'
import QRCode from 'react-qr-code'
import { QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog'

interface TicketQRCodeModalProps {
    bookingId: string
    ticketCode?: string // Mã vé hiển thị cho đẹp (nếu có)
}

const TicketQRCodeModal: React.FC<TicketQRCodeModalProps> = ({
    bookingId,
    ticketCode,
}) => {
    // Nếu không có bookingId thì không render gì cả
    if (!bookingId) return null

    return (
        <Dialog>
            {/* 1. Nút bấm để mở Modal (Trigger) */}
            <DialogTrigger asChild>
                <Button
                    className="cursor-pointer w-full bg-transparent mt-2"
                    variant="outline"
                >
                    <QrCode className="mr-2 h-4 w-4" />
                    Hiện mã vé
                </Button>
            </DialogTrigger>

            {/* 2. Nội dung Modal */}
            <DialogContent className="sm:max-w-md flex flex-col items-center bg-white">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Mã vé điện tử
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Vui lòng đưa mã này cho nhân viên soát vé
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 bg-white rounded-xl border-2 border-dashed border-gray-200 shadow-sm my-2">
                    <QRCode
                        value={bookingId} // Giá trị để quét (thường là ID hoặc mã vé hóa đơn)
                        size={200}
                        style={{
                            height: 'auto',
                            maxWidth: '100%',
                            width: '100%',
                        }}
                        viewBox={`0 0 256 256`}
                    />
                </div>

                <div className="text-center space-y-1">
                    <p className="text-sm text-muted-foreground uppercase font-semibold">
                        Mã đặt chỗ
                    </p>
                    <p className="text-lg font-mono font-bold tracking-wider text-primary">
                        {ticketCode || bookingId.substring(0, 8).toUpperCase()}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TicketQRCodeModal
