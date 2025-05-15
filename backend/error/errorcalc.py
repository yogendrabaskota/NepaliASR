from jiwer import wer

def calculate_wer(reference_list, hypothesis_list):
    """
    Calculates Word Error Rate (WER) between two lists of sentences.
    """
    return wer(reference_list, hypothesis_list)

def calculate_ser(reference_list, hypothesis_list):
    """
    Calculates Sentence Error Rate (SER) between two lists of sentences.
    """
    errors = sum([ref.strip() != hyp.strip() for ref, hyp in zip(reference_list, hypothesis_list)])
    return errors / len(reference_list)
