import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const EMOTION_STATS = [
  { emotion: "Calm & Collected", trades: 25, winRate: "76%", pnl: 1250.00 },
  { emotion: "Anxious / FOMO", trades: 12, winRate: "33%", pnl: -450.00 },
  { emotion: "Greedy", trades: 5, winRate: "20%", pnl: -800.00 },
];

const METHOD_STATS = [
  { method: "Support/Resistance Breakout", trades: 18, winRate: "66%", pnl: 850.00 },
  { method: "Trend Following", trades: 14, winRate: "71%", pnl: 620.00 },
  { method: "Mean Reversion", trades: 10, winRate: "40%", pnl: -150.00 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-1">Deep dive into your trading psychology and edge.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Performance by Emotion */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Emotion</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Emotion</TableHead>
                  <TableHead>Trades</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead className="text-right">Net PnL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EMOTION_STATS.map((stat) => (
                  <TableRow key={stat.emotion}>
                    <TableCell className="font-medium">{stat.emotion}</TableCell>
                    <TableCell>{stat.trades}</TableCell>
                    <TableCell>{stat.winRate}</TableCell>
                    <TableCell className={`text-right font-bold ${stat.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                      {stat.pnl >= 0 ? "+" : ""}${stat.pnl}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Performance by Method */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Setup / Method</TableHead>
                  <TableHead>Trades</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead className="text-right">Net PnL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {METHOD_STATS.map((stat) => (
                  <TableRow key={stat.method}>
                    <TableCell className="font-medium">{stat.method}</TableCell>
                    <TableCell>{stat.trades}</TableCell>
                    <TableCell>{stat.winRate}</TableCell>
                    <TableCell className={`text-right font-bold ${stat.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                      {stat.pnl >= 0 ? "+" : ""}${stat.pnl}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
