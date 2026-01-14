import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { BRAND } from '@/lib/constants';
import PdfViewer from '@/components/proposal/PdfViewer';

interface ProposalPageProps {
  params: Promise<{ id: string }>;
}

async function getProposal(id: string) {
  const proposal = await prisma.proposal.findUnique({
    where: { id, isVisible: true },
  });

  return proposal;
}

export async function generateMetadata({ params }: ProposalPageProps): Promise<Metadata> {
  const { id } = await params;
  const proposal = await getProposal(id);

  if (!proposal) {
    return {
      title: '제안서를 찾을 수 없습니다',
    };
  }

  return {
    title: `${proposal.title} | ${BRAND.nameKo}`,
    description: `${BRAND.nameKo} 제안서`,
    openGraph: {
      title: `${proposal.title} | ${BRAND.nameKo}`,
      description: `${BRAND.nameKo} 제안서`,
      type: 'article',
    },
  };
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { id } = await params;
  const proposal = await getProposal(id);

  if (!proposal) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-[#013A46] text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-xl font-bold">{proposal.title}</h1>
          <p className="text-sm text-gray-300 mt-1">PARTY BEEN 제안서</p>
        </div>
      </header>

      {/* PDF 뷰어 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <PdfViewer
          fileUrl={proposal.fileUrl}
          filename={proposal.filename}
          title={proposal.title}
        />
      </main>
    </div>
  );
}
