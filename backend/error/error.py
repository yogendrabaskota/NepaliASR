from errorcalc import calculate_wer, calculate_ser

# Correct outputs (reference)
references = [
    "म स्कुल जान्छु",
    "उ बिद्यालय गयो",
    "उसले खाना खायो",
    "तपाईंको नाम के हो?",
    "म बिहानै उठेर कलेज जान्छु।",
    "उनी पुस्तकालयमा पढ्दै छन्",
    "हामीले फिल्म हेरेर रमाइलो गर्यौं",
    "सरकारले नयाँ नियम लागू गरेको छ",
    "बालबालिकालाई सिकाउन सजिलो भाषामा कुरा गर्नुपर्छ",

]

# Model outputs (hypothesis)
hypotheses = [
    "म स्कुल जान्छु",
    "उ भिद्यालय गहयो",
    "उसले खाना खायो",
    "तपाईंको माम के हो",
    "म बिहानै उठेर कलेज खान्छु",
    "उनी पुस्तकालयमा पढ्दै छन्",
    "हामीले खिम हेरेर रमाइलो गर्यौं",
    "झरकाले नया नियम लागु गरेको छ",
    "बाल बालिकालाई सिकाउन सजिलो हाषामा कुरा गर्नुपर्छ",


]

# Calculate errors
wer_result = calculate_wer(references, hypotheses)
ser_result = calculate_ser(references, hypotheses)

print("Word Error Rate (WER):", wer_result)
print("Sentence Error Rate (SER):", ser_result)
