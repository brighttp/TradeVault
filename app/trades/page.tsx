import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const OPEN_POSITIONS = [
  { id: "trd_888", symbol: "SOL-USDT-SWAP", direction: "LONG", entry: 110.5, pnl: 45.2 },
];

const COMPLETED_POSITIONS = [
  { id: "trd_123", symbol: "BTC-USDT-SWAP", direction: "LONG", entry: 64000, exit: 65000, pnl: 450.50, status: "INCOMPLETE" },
  { id: "trd_124", symbol: "ETH-USDT-SWAP", direction: "SHORT", entry: 3500, exit: 3600, pnl: -120.00, status: "INCOMPLETE" },
  { id: "trd_125", symbol: "AVAX-USDT-SWAP", direction: "LONG", entry: 35.5, exit: 40.2, pnl: 230.00, status: "COMPLETE" },
];

export default function TradesPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Trades</h2>
        <p className="text-muted-foreground mt-1">Manage your open positions and review completed trades.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Open Positions */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">Open Positions</h3>
          <div className="space-y-4">
            {OPEN_POSITIONS.map(pos => (
              <Card key={pos.id} className="border-border">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{pos.symbol}</span>
                      <Badge variant="outline" className={pos.direction === "LONG" ? "text-[#22c55e] border-[#22c55e]/20" : "text-[#ef4444] border-[#ef4444]/20"}>
                        {pos.direction}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Entry: ${pos.entry}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${pos.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                      {pos.pnl >= 0 ? "+" : ""}${pos.pnl}
                    </div>
                    <div className="text-xs text-muted-foreground">Unrealized PnL</div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {OPEN_POSITIONS.length === 0 && (
              <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                No open positions found.
              </div>
            )}
          </div>
        </div>

        {/* Completed Positions */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-border pb-2">Completed Positions</h3>
          <Card>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Symbol</TableHead>
                  <TableHead>PnL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPLETED_POSITIONS.map((pos) => (
                  <TableRow key={pos.id}>
                    <TableCell>
                      <div className="font-medium">{pos.symbol}</div>
                      <div className={`text-xs ${pos.direction === "LONG" ? "text-[#22c55e]" : "text-[#ef4444]"}`}>{pos.direction}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${pos.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                        {pos.pnl >= 0 ? "+" : ""}${pos.pnl}
                      </span>
                    </TableCell>
                    <TableCell>
                      {pos.status === "INCOMPLETE" ? (
                        <Badge variant="outline" className="text-[#eab308] border-[#eab308]/20 bg-[#eab308]/5">Review Needed</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[#22c55e] border-[#22c55e]/20 bg-[#22c55e]/5">Completed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant={pos.status === "INCOMPLETE" ? "default" : "secondary"} asChild>
                        <Link href={`/trades/${pos.id}`}>
                          {pos.status === "INCOMPLETE" ? "Review" : "View"} <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

      </div>
    </div>
  );
}
