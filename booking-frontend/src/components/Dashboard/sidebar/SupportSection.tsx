import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import authAction from '@/actions/authAction'
import { toast } from 'react-toastify'

const handleLogout = async () => {
    await authAction.clearToken()
    toast.success('Đăng xuất thành công!')
    window.location.href = '/schedule'
}

export default function SupportSection() {
    return (
        <Card className="shadow-sm">
            <CardContent className="flex flex-col gap-3 p-4">
                <Button
                    variant="outline"
                    className="w-full justify-start text-sm bg-white hover:bg-[#EAF4FF] hover:text-[#0064D2] hover:border-[#C2DFFF] cursor-pointer  active:scale-[0.98]"
                >
                    <MessageCircle className="h-4 w-4 mr-2 text-primary" />
                    Chat với chúng tôi
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-red-600 cursor-pointer transition-all duration-200 hover:bg-transparent hover:opacity-70 hover:text-red-600 active:scale-[0.98]"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                </Button>
            </CardContent>
        </Card>
    )
}
