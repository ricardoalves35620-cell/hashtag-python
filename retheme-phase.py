import re, sys

# Neutral replacements. Case-preserving pairs are listed longest-first so that
# compound words are rewritten before their parts (claim_total before claim).
PAIRS = [
    # English
    ('policyholder', 'member'), ('policy_active', 'plan_active'), ('policy', 'plan'),
    ('monthly_premium', 'monthly_fee'), ('annual_premium', 'annual_fee'),
    ('premium', 'fee'),
    ('deductible', 'discount'),
    ('payout', 'refund'),
    ('claims', 'orders'), ('claim', 'order'),
    ('insurance', 'subscription'),
    ('adjuster', 'reviewer'),
    ('construction site', 'project site'), ('construction', 'project'),
    ('inspection', 'review'),
    # Portuguese
    ('apólice', 'plano'), ('apolice', 'plano'),
    ('premio_mensal', 'taxa_mensal'), ('premio_anual', 'taxa_anual'),
    ('prêmio', 'taxa'), ('premio', 'taxa'),
    ('franquia', 'desconto'),
    ('sinistros', 'pedidos'), ('sinistro', 'pedido'),
    ('seguradora', 'loja'), ('seguro', 'assinatura'),
    ('ajustador', 'revisor'),
    ('empreiteiro', 'equipe'),
    ('construção', 'projeto'), ('construcao', 'projeto'),
    ('obras', 'projetos'), ('obra', 'projeto'),
    ('vistoria', 'revisão'),
]

def preserve_case(src, dst):
    if src.isupper(): return dst.upper()
    if src[:1].isupper(): return dst[:1].upper() + dst[1:]
    return dst

def retheme(text):
    total = 0
    for old, new in PAIRS:
        pattern = re.compile(re.escape(old), re.IGNORECASE)
        def sub(m):
            nonlocal total
            total += 1
            return preserve_case(m.group(0), new)
        text = pattern.sub(sub, text)
    return text, total

if __name__ == '__main__':
    path = sys.argv[1]
    src = open(path, encoding='utf-8').read()
    out, n = retheme(src)
    open(path, 'w', encoding='utf-8').write(out)
    print(f'{path}: {n} replacements')
